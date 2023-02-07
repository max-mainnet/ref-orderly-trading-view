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
