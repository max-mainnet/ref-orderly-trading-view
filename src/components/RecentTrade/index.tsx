import React, { useState, useEffect, useContext } from 'react';
import { OrderlyContext, useOrderlyContext } from '../../orderly/OrderlyContext';

function RecentTrade() {
  const value = useOrderlyContext();
  console.log('value: ', value);

  //   console.log('recentTrades: ', recentTrades);

  return <div className=''></div>;
}

export default RecentTrade;
