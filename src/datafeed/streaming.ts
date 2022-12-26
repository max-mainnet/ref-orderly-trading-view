// @ts-noCheck

import { config } from '../near';

import { getOrderlyConfig } from '../config';
import { ResolutionToSeconds, parseFullSymbol, parseResolution } from './helpers';
import io from 'socket.io-client';

// import { WebSocket } from 'ws';

const channelToSubscription = new Map();

const ws = new WebSocket(
  `${getOrderlyConfig().ORDERLY_WS_ENDPOINT}/${
    !!window.selector && window.selector.isSignedIn() ? window.selector.accountId : 'OqdphuyCtYWxwzhxyLLjOWNdFP7sQt8RPWzmb5xY'
  }`
);

function sendPing() {
  ws.send(
    JSON.stringify({
      event: 'ping',
      ts: Date.now(),
    })
  );
}

function sendPong() {
  ws.send(
    JSON.stringify({
      event: 'pong',
      ts: Date.now(),
    })
  );
}

ws.onopen = () => {
  sendPing();
};

ws.onmessage = (event) => {
  const { event: data_event } = JSON.parse(event.data);

  console.log('msg event', event);

  if (data_event) {
    if (data_event === 'ping') {
      sendPong();
      sendPing();
    }

    // else if (data_event === 'pong') {
    //   sendPing();
    // }
  }

  // alert('message');
};

ws.onclose = (event) => {
  console.log('close event: ', event);
  alert('close');
};

ws.onerror = (event) => {
  console.log('error event: ', event);

  // alert('error ');
};

ws.onmessage = (event) => {
  console.log('[socket] Message:', event.data);

  const { data, topic, event: dataEvent } = JSON.parse(event.data);

  console.log('dataEvent: ', dataEvent);

  if (dataEvent === 'ping') {
    sendPong();
    return;
  }

  console.log('data: ', data, topic, 'topic');

  if (!topic || topic.indexOf('kline') === -1) {
    console.log('return goto');
    return;
  }

  const { endTime, high, low, open, startTime, close } = data;

  const subscriptionItem = channelToSubscription.get(topic);
  if (subscriptionItem === undefined) {
    return;
  }

  const lastBar = subscriptionItem.lastBar;
  console.log('lastBar: ', lastBar);

  const nextDailyBarTime = getNextBarTime(lastBar.time, subscriptionItem.resolution);
  console.log('nextDailyBarTime: ', nextDailyBarTime);

  let bar;
  if (startTime >= nextDailyBarTime) {
    bar = {
      time: nextDailyBarTime,
      open: open,
      high: high,
      low: low,
      close: close,
    };
    console.log('[socket] Generate new bar', bar);
  } else {
    bar = {
      ...lastBar,
      high: Math.max(lastBar.high, high),
      low: Math.min(lastBar.low, low),
      close: close,
    };
    console.log('[socket] Update the latest bar by price', low);
  }
  subscriptionItem.lastBar = bar;
  console.log('subscriptionItem: ', subscriptionItem);

  console.log('bar: ', bar);

  // send data to every subscriber of that symbol
  subscriptionItem.handlers.forEach((handler) => handler.callback(bar));
};

function getNextBarTime(barTime: number, resolution: string) {
  return barTime + ResolutionToSeconds(resolution) * 1000;
}

export function subscribeOnStream(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback, lastBar) {
  console.log('lastBar: ', lastBar);

  const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
  const channelString = `0~${parsedSymbol.exchange}~${parsedSymbol.fromSymbol}~${parsedSymbol.toSymbol}`;

  const topic = `SPOT_${parsedSymbol.fromSymbol}_${parsedSymbol.toSymbol}@kline_${parseResolution(resolution)}`;

  const handler = {
    id: subscriberUID,
    callback: onRealtimeCallback,
    topic,
  };

  const msg = {
    event: 'subscribe',
    topic,
    id: topic,
    ts: Date.now(),
  };
  let subscriptionItem = channelToSubscription.get(topic);

  console.log('subscriptionItem: ', subscriptionItem);
  if (subscriptionItem) {
    // already subscribed to the channel, use the existing subscription

    subscriptionItem.handlers.push(handler);
    return;
  }

  subscriptionItem = {
    subscriberUID,
    resolution,
    lastBar,
    handlers: [handler],
  };

  console.log('subscriptionItem: ', subscriptionItem);

  console.log('[subscribeBars]: Subscribe to streaming. Channel:', channelString);

  channelToSubscription.set(topic, subscriptionItem);

  ws.send(JSON.stringify(msg));
}

export function unsubscribeFromStream(subscriberUID) {
  // find a subscription with id === subscriberUID
  for (const topic of channelToSubscription.keys()) {
    const subscriptionItem = channelToSubscription.get(topic);
    const handlerIndex = subscriptionItem.handlers.findIndex((handler) => handler.id === subscriberUID);

    if (handlerIndex !== -1) {
      // remove from handlers

      const tmpHandler = subscriptionItem.handlers[handlerIndex];

      subscriptionItem.handlers.splice(handlerIndex, 1);
      if (subscriptionItem.handlers.length === 0) {
        // unsubscribe from the channel, if it was the last handler
        // socket.emit('SubRemove', { subs: [channelString] });
        const msg = {
          event: 'unsubscribe',
          topic: tmpHandler.topic,
          id: tmpHandler.topic,
        };

        ws.send(JSON.stringify(msg));

        channelToSubscription.delete(topic);
        break;
      }
    }
  }
}
