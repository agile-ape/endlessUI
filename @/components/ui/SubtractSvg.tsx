import Image from 'next/image';
import type { FC } from 'react';

type SubtractSvgType = {
  color: string;
  className: string;
}
const SubtractSvg: FC<SubtractSvgType> = ({ color, className }) => {
  return (
    <div className={className}>
      {/* Use the next/image component to display the SVG */}
      {/* <Image
        src="/background/subtractTicket.svg" // Replace with the actual path to your SVG file
        alt="Subtract"
        width={220}
        height={213}
        // className={className}
      > */}
        {/* Set the fill attribute directly based on the 'color' prop */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="220"
          height="213"
          viewBox="0 0 220 213"
          fill={color} // Use the 'color' prop here
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 0H85.335C89.5465 9.12891 99.0059 15.4909 110 15.4909C120.994 15.4909 130.454 9.12891 134.665 0H212C216.418 0 220 3.58172 220 8V205C220 209.418 216.418 213 212 213H8.00001C3.58173 213 0 209.418 0 205V8C0 3.58172 3.58172 0 8 0ZM202 23.027C206.418 23.027 210 19.5905 210 15.3513C210 11.1122 206.418 7.67566 202 7.67566C197.582 7.67566 194 11.1122 194 15.3513C194 19.5905 197.582 23.027 202 23.027Z"
          />
        </svg>
      {/* </Image> */}
    </div>
  );
}

export default SubtractSvg;
