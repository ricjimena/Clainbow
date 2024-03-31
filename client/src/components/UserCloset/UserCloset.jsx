import React from 'react'
import { ProductCard } from '../ProductCard/ProductCard'

export const UserCloset = ({orderedArticles}) => {
  return (
    <div className="d-flex justify-content-center align-items-start">
    <div className="d-flex justify-content-center flex-wrap gap-3">

        {orderedArticles?.map((elem, i) => {
          return <div key={i}>
            <ProductCard elem={elem} prevLocation={'/userProfile'} />
          </div>
          
        })}
    </div>
    </div>
  )
}
