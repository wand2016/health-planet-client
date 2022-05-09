type Tags = {
  weight: "6021";
  /** body fat percentage */
  bfp: "6022";
};

type Tag = Tags[keyof Tags];

type Datum = {
  /** YmdHi */
  date: string;
  /** weight or body fat */
  keydata: string;
  /** どうでもいい */
  model: string;
  tag: Tag;
};

export type InnerscanResponse = {
  /** Ymd */
  birth_date: string;
  data: Datum[];
  height: string;
  sex: string;
};
