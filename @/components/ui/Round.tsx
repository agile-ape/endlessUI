import React, { FC } from "react";
type RoundType = {
  stageRound: string;
  stageType: string;
  title1: string;
  title2?: string;
  title3?: string;
  title4?: string;
  fontTitleSize: string;
}
const Round: FC<RoundType> = ({ stageRound, stageType, title1, title2, title3, title4, fontTitleSize }) => {
  return (
    <div className="text-center">
      {stageType === "beginning" && (
        <p className="text-lg">Beginnings</p>
      )}
      <p className="text-lg">{stageRound}</p>
      <h1 className={`uppercase mt-2 ${fontTitleSize}`}>{title1}</h1>
      {title2 && (
        <h1 className={`uppercase ${fontTitleSize}`}>{title2}</h1>
      )}
      {title3 && (
        <h1 className={`uppercase ${fontTitleSize}`}>{title3}</h1>
      )}
      {title4 && (
        <h1 className={`uppercase ${fontTitleSize}`}>{title4}</h1>
      )}
    </div>
  );
}

export default Round