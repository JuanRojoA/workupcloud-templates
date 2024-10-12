type TailwindP =
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

type TailwindPY = `py-${TailwindP}`;
type TailwindPX = `px-${TailwindP}`;
type TailwindPT = `pt-${TailwindP}`;
type TailwindPR = `pr-${TailwindP}`;
type TailwindPB = `pb-${TailwindP}`;
type TailwindPL = `pl-${TailwindP}`;

type TailwindPVariants =
    | `p-${TailwindP}`
    | TailwindPY
    | TailwindPX
    | TailwindPT
    | TailwindPR
    | TailwindPB
    | TailwindPL;

export type TPadding = TailwindPVariants | TailwindPVariants[];
