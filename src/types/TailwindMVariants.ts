type TailwindM =
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 14
    | 16
    | 20
    | 24
    | 28
    | 32
    | 36
    | 40
    | 44
    | 48
    | 52
    | 56
    | 60
    | 64
    | 72
    | 80
    | 96
    | "px";

type TailwindMY = `my-${TailwindM}`;
type TailwindMX = `mx-${TailwindM}`;
type TailwindMT = `mt-${TailwindM}`;
type TailwindMR = `mr-${TailwindM}`;
type TailwindMB = `mb-${TailwindM}`;
type TailwindML = `ml-${TailwindM}`;

type TailwindMVariants =
    | `m-${TailwindM}`
    | TailwindMY
    | TailwindMX
    | TailwindMT
    | TailwindMR
    | TailwindMB
    | TailwindML;

export type TMargin = TailwindMVariants | TailwindMVariants[];
