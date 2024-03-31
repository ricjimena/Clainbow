import axios from "axios";
import React, { useContext } from "react";
import { ProductCard } from "../ProductCard/ProductCard";
import { ClainbowContext } from "../../Context/ClainbowProvider";

export const UserLikedArticlesGallery = ({likedArticles}) => {
  const { likes } = useContext(ClainbowContext);

  return (
    <div className="d-flex justify-content-center align-items-start">
    <div className="d-flex justify-content-center flex-wrap gap-3">

        {likedArticles?.map((elem, inLike) => {
          return <ProductCard key={inLike} elem={elem} />;
        })}
    </div>
    </div>

  );
};
