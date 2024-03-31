import React, { useContext } from "react";
import { ProductCard } from "../ProductCard/ProductCard";
import { ClainbowContext } from "../../Context/ClainbowProvider";

export const UserProductsGallery = ({ userArticles }) => {

  const { likes } = useContext(ClainbowContext);
    
  return (
    <div className="d-flex justify-content-center align-items-start">

<div className="d-flex justify-content-center flex-wrap gap-3">
  
        {userArticles.map((elem, i) => {
          return <ProductCard key={i} elem={elem} />;
        })}
</div>

    </div>
  );
};
