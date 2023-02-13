import React, { useCallback, useEffect, useState } from 'react';

export function NearIcon() {
  return (
    <svg width='18' height='16' viewBox='0 0 18 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M2.84211 3.21939V12.483L7.57895 8.94375L8.05263 9.35915L4.08047 14.954C2.6046 16.308 0 15.3919 0 13.5188V2.08119C0 0.143856 2.75709 -0.738591 4.18005 0.743292L15.1579 12.1757V3.29212L10.8947 6.4513L10.4211 6.03589L13.7996 0.813295C15.2097 -0.696027 18 0.178427 18 2.12967V13.3139C18 15.2512 15.2429 16.1336 13.8199 14.6518L2.84211 3.21939Z'
        fill='white'
      />
    </svg>
  );
}

export function OrderStateOutline() {
  return (
    <svg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <circle cx='7' cy='7' r='6' stroke='#62C440' stroke-width='1.4' stroke-dasharray='1.4 1.4' />
    </svg>
  );
}

export function GrayBgBox(props: any) {
  return (
    <svg width='90' height='26' viewBox='0 0 90 26' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M0 6C0 2.68629 2.68629 0 6 0H85.8366C88.7333 0 90.6696 2.98345 89.4898 5.6291L81.463 23.6291C80.8199 25.0711 79.3887 26 77.8097 26H5.99999C2.68629 26 0 23.3137 0 20V6Z'
        fill='#213A4D'
      />
    </svg>
  );
}

export function ArrowCurve() {
  return (
    <svg width='8' height='10' viewBox='0 0 8 10' fill='none' className='ml-1' xmlns='http://www.w3.org/2000/svg'>
      <path d='M1 9C1.33333 7.16667 3 3 7 1M7 1H2.5M7 1V5.25' stroke='white' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round' />
    </svg>
  );
}

export function OrderSmile(props: any) {
  return (
    <svg className='relative z-10' width='16' height='14' viewBox='0 0 16 14' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M7.05882 14C3.16034 14 0 10.866 0 7C0 3.13401 3.16034 0 7.05882 0C10.0621 0 12.6273 1.85996 13.6471 4.48168C13.951 5.26313 16 7 16 7C16 7 13.951 8.73687 13.6471 9.51832C12.6273 12.14 10.0621 14 7.05882 14ZM8.38964 8.56407C8.6304 8.22701 9.09881 8.14894 9.43587 8.3897C9.77293 8.63045 9.851 9.09887 9.61024 9.43593C9.22385 9.97688 8.1575 10.75 6.49994 10.75C4.84238 10.75 3.77603 9.97688 3.38964 9.43593C3.14888 9.09887 3.22695 8.63045 3.56401 8.3897C3.90107 8.14894 4.36948 8.22701 4.61024 8.56407C4.70004 8.68979 5.30036 9.25 6.49994 9.25C7.69952 9.25 8.29984 8.68979 8.38964 8.56407ZM10 5C10 4.44772 9.55228 4 9 4C8.44772 4 8 4.44772 8 5V6C8 6.55228 8.44772 7 9 7C9.55228 7 10 6.55228 10 6V5ZM4 4C4.55228 4 5 4.44772 5 5V6C5 6.55228 4.55228 7 4 7C3.44772 7 3 6.55228 3 6V5C3 4.44772 3.44772 4 4 4Z'
        fill='#00C6A2'
      />
    </svg>
  );
}

export function NearIConSelectModal() {
  return (
    <svg width='17' height='17' viewBox='0 0 17 17' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <rect width='17' height='17' rx='6' fill='#7E8A93' fill-opacity='0.15' />
      <path
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M5.57895 5.74622V10.7709L8.21053 8.85114L8.47368 9.07646L6.26693 12.1111C5.447 12.8456 4 12.3487 4 11.3327V5.12885C4 4.07803 5.53172 3.59938 6.32225 4.40317L12.4211 10.6042V5.78567L10.0526 7.49922L9.78947 7.2739L11.6664 4.44114C12.4498 3.62247 14 4.09678 14 5.15515V11.2215C14 12.2723 12.4683 12.751 11.6777 11.9472L5.57895 5.74622Z'
        fill='#91A2AE'
      />
    </svg>
  );
}

export function OutLinkIcon(props: any) {
  return (
    <svg {...props} width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M8.96806 12H3.03194C1.36082 12 0 10.6394 0 8.96857V3.03143C0 1.36059 1.36082 0 3.03194 0H5.6096C5.97262 0 6.26669 0.294018 6.26669 0.656979C6.26669 1.01994 5.97262 1.31396 5.6096 1.31396H3.03194C2.5736 1.31396 2.14163 1.4924 1.81714 1.81683C1.49265 2.14126 1.31418 2.57317 1.31418 3.03143V8.96654C1.31418 9.42481 1.49265 9.85671 1.81714 10.1811C2.14163 10.5056 2.5736 10.684 3.03194 10.684H8.96806C9.91516 10.684 10.6858 9.91348 10.6858 8.96654V6.19466C10.6858 5.96147 10.8116 5.74248 11.0144 5.62487C11.1137 5.5681 11.2273 5.53768 11.3429 5.53768C11.4585 5.53768 11.5721 5.5681 11.6715 5.62487C11.8743 5.74248 12 5.95945 12 6.19466V8.96654C12 10.6394 10.6412 12 8.96806 12ZM11.0284 4.17082C11.1238 4.22556 11.2333 4.25395 11.3428 4.25395C11.4523 4.25395 11.5618 4.22354 11.6592 4.16879C11.8539 4.05727 11.9735 3.84841 11.9735 3.62537V0.656833C11.9735 0.310098 11.6916 0.0282495 11.3448 0.0282495H8.37576C8.02897 0.0282495 7.74707 0.310098 7.74707 0.656833C7.74707 1.00357 8.02897 1.28542 8.37576 1.28542H9.82618L5.55483 5.55604L5.55077 5.56009C5.43977 5.67911 5.37941 5.83662 5.38243 5.99933C5.38546 6.16204 5.45164 6.3172 5.567 6.43201C5.68665 6.55164 5.84281 6.61653 6.01114 6.61653C6.17136 6.61653 6.32346 6.5557 6.43906 6.44823L6.44109 6.4462L10.7141 2.17392V3.6274C10.7141 3.85044 10.8358 4.05929 11.0284 4.17082Z'
        fill='currentColor'
      />
    </svg>
  );
}

export function SpinIcon() {
  return (
    <svg width='14' className='animate-spin' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13'
        stroke='white'
        stroke-width='2'
        stroke-linecap='round'
      />
    </svg>
  );
}

export function CheckedFlow() {
  return (
    <div className='inline-flex items-center relative justify-center'>
      <svg width='12' className='absolute z-10' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <circle cx='6' cy='6' r='5.5' fill='#00C6A2' stroke='#00C6A2' />
      </svg>

      <svg width='8' height='7' className='relative z-20' viewBox='0 0 8 7' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path d='M1 3L3 5L7 1' stroke='#031420' stroke-width='1.6' stroke-linecap='round' />
      </svg>
    </div>
  );
}

export function UnCheckedFlow() {
  return (
    <svg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <circle cx='6' cy='6' r='5.5' fill='white' fill-opacity='0.08' stroke='#00C6A2' />
    </svg>
  );
}

export function CheckFlow({ checked }: { checked: boolean }) {
  return checked ? <CheckedFlow /> : <UnCheckedFlow />;
}
