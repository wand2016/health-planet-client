export const TAG_WEIGHT = "6021";
/** body fat percentage */
export const TAG_BFP = "6022";

type TagWeight = typeof TAG_WEIGHT;
type TagBfp = typeof TAG_BFP;
export type Tag = TagWeight | TagBfp;

type Datum = {
  /** YmdHi */
  date: string;
  /** weight or body fat */
  keydata: string;
  /** どうでもいい */
  model: string;
  tag: Tag;
};

export type Data = Datum[];

export type InnerscanResponse = {
  /** Ymd */
  birth_date: string;
  data: Data;
  height: string;
  sex: string;
};
