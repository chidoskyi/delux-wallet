import React from 'react'
import { NFT } from '@/src/lib/types'

  interface NFTItemProps {
  nft: NFT
  onClick: () => void
}

export const NFTItem = ({
    nft,
    onClick,
  }: NFTItemProps) => {
    return (
      <div
        className="bg-gray-800 rounded-lg p-3 cursor-pointer hover:bg-gray-700"
        onClick={onClick}
      >
        <img
          src={nft.image || "/placeholder.svg"}
          alt={nft.name}
          className="w-full h-32 object-cover rounded-lg mb-2"
        />
        <p className="font-medium text-sm truncate">{nft.name}</p>
        <p className="text-gray-400 text-xs truncate">{nft.collection}</p>
        <p className="text-blue-400 text-sm">{nft.price}</p>
      </div>
    )
  }