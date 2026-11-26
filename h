[33mcommit bd1e10ba52f22c3dd1a1b63f850017c1ee20c3d3[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mmain[m[33m, [m[1;31morigin/main[m[33m)[m
Author: Piratessafaris <piratessafaris@gmail.com>
Date:   Thu Nov 26 14:31:57 2026 +0300

    Replace remaining compass icons with official logo

 src/pages/Home.jsx | 16 [32m++++++++++++[m[31m----[m
 vite.config.js     | 14 [32m+++++++[m[31m-------[m
 2 files changed, 19 insertions(+), 11 deletions(-)

[33mcommit ba4202b3496aaa6055dcd804228776ddcddf1d6b[m
Author: Piratessafaris <piratessafaris@gmail.com>
Date:   Thu Nov 26 14:12:54 2026 +0300

    Use official logo.jpeg for PWA and compress Thiba Falls poster

 public/apple-touch-icon.png | Bin [31m960[m -> [32m0[m bytes
 public/pwa-192.png          | Bin [31m1018[m -> [32m0[m bytes
 public/pwa-512.png          | Bin [31m3443[m -> [32m0[m bytes
 3 files changed, 0 insertions(+), 0 deletions(-)

[33mcommit 28389a008e06d4adc16822e2b9278146d2db3023[m
Author: Piratessafaris <piratessafaris@gmail.com>
Date:   Thu Nov 26 13:46:15 2026 +0300

    Update logo icon and compressed Thiba Falls poster

 index.html              |   6 [32m+[m[31m-[m
 public/thiba-falls.jpeg | Bin [31m0[m -> [32m5385169[m bytes
 public/thiba-falls.jpg  | Bin [31m0[m -> [32m416425[m bytes
 src/components/UI.jsx   |   8 [32m+[m[31m-[m
 src/lib/auth.jsx        | 475 [32m+++[m[31m-------------------------------------[m
 src/pages/Account.jsx   |  13 [32m+[m[31m-[m
 src/pages/Auth.jsx      | 559 [32m++++++++++++++++++++++++++++++++++[m[31m--------------[m
 src/pages/Home.jsx      |   2 [32m+[m[31m-[m
 supabase/schema.sql     |   3 [32m+[m[31m-[m
 9 files changed, 457 insertions(+), 609 deletions(-)

[33mcommit d20e0550ab7c25347419c68e20e8512fdb871cc4[m
Author: John Kengara <johnkengara07@gmail.com>
Date:   Thu Nov 26 01:31:17 2026 +0300

    Upgrade Auth and Account hub with benefits, preferences, and sign-out warning

 src/lib/auth.jsx      | 482 [32m++++++++++++++++++++++++++++++++++++++++++++++[m[31m----[m
 src/pages/Account.jsx | 383 [32m++++++++++++++++++++++++++++++++++[m[31m-----[m
 2 files changed, 792 insertions(+), 73 deletions(-)

[33mcommit 9af9d2495d8996ac4b98c8b7b71f8f91797f307d[m
Author: John Kengara <johnkengara07@gmail.com>
Date:   Thu Nov 26 01:07:12 2026 +0300

    Fix duplicated Supabase URL in Vercel
