import { Link } from "@remix-run/react";

export default function Nav() {
  return (
    <nav className="font-heading flex flex-row items-center gap-6 bg-red-900 p-4 text-sm font-medium uppercase text-white">
      <div>
        <Link to="/">
          {/* <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            // width="24pt"
            // height="24pt"
            viewBox="0 0 600 600"
            preserveAspectRatio="xMidYMid meet"
          >
            <g transform="translate(0.000000,600.000000) scale(0.100000,-0.100000)">
              <path
                d="M2750 5989 c-906 -76 -1741 -568 -2243 -1323 -516 -774 -645 -1730
            -352 -2611 250 -751 776 -1364 1480 -1725 647 -332 1406 -416 2110 -235 997
            257 1781 992 2105 1975 352 1066 70 2246 -726 3044 -630 631 -1493 949 -2374
            875z m545 -274 c769 -89 1434 -470 1895 -1086 304 -407 481 -869 531 -1394 21
            -213 1 -565 -41 -762 -13 -60 2 -58 -142 -22 -215 53 -469 188 -753 400 -372
            278 -808 717 -1199 1207 -112 140 -141 170 -167 176 -41 8 -797 8 -839 0 -26
            -6 -52 -32 -145 -149 -631 -795 -1291 -1371 -1800 -1574 -136 -54 -296 -96
            -306 -80 -10 16 -36 191 -50 334 -14 147 -6 468 15 613 89 597 357 1132 776
            1552 447 446 1014 716 1660 789 126 14 426 12 565 -4z m173 -1792 c229 -287
            460 -542 701 -775 l165 -158 -1333 0 -1332 0 228 228 c243 241 437 457 628
            696 l116 146 358 0 359 0 110 -137z"
                fill="currentColor"
              />
              <path
                d="M4004 5136 c-124 -29 -226 -97 -293 -197 -127 -190 -105 -435 54
            -595 149 -150 360 -186 551 -93 26 12 75 49 111 82 257 241 163 672 -172 787
            -78 27 -175 33 -251 16z"
                fill="currentColor"
              />
            </g>
          </svg> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </Link>
      </div>
      <div>
        <Link to="/films">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
            />
          </svg>
        </Link>
      </div>
    </nav>
  );
}
