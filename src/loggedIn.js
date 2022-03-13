import './App.css';
import Web3 from 'web3'
import nft_abi from './abi_nft.json'
import { useState } from 'react';
import { create } from 'ipfs-http-client'
import { useWeb3React } from '@web3-react/core';


function LoggedIn() {

  const account=useWeb3React();

  const [_mintTo,set_mintTo] = useState("");
  const [_transferTo,set_transferTo] = useState("");
  const [_tokenId,setTokenId] = useState("");
  let [_uri,setUri] = useState("");
  // const [_from,setFrom] = useState("");

  
  const web3 = new Web3(window.ethereum);
  const nftAddress= "0x02Ae61BEaeeB0E67a8493Ff808153586D4705DD1";
  const Contract =  new web3.eth.Contract(nft_abi, nftAddress);

  const client = create('https://ipfs.infura.io:5001/api/v0')

  
  async function Upload(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(file)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setUri(_uri = url);
      console.log("URI: "+_uri)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }


// MINT FUNCTION
  const Mint=() => {

    console.log("Mint to:"+_mintTo)
    console.log("Token Id: "+_tokenId)
    console.log("Uri: "+_uri)

    Contract.methods.mint(_mintTo,_tokenId,_uri).send({from:account.account})
      .on('transactionHash', function(hash){
          console.log(hash)
      })
      .on('receipt', function(receipt){
          console.log(receipt)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber)
      })
      .on('error', function(error, receipt) {
          console.log(error)
      });
  
  }


  // TRANSFER FROM FUNCTION 
  const TransferFrom=() => {

    const _from = _mintTo;

    console.log("From: "+_from)
    console.log("Transfer to: "+_transferTo)
    console.log("Token id: "+_tokenId)


      Contract.methods.transferFrom(_from,_transferTo,_tokenId).send({from:account.account})
      .on('transactionHash', function(hash){
          console.log(hash)
      })
      .on('receipt', function(receipt){
          console.log(receipt)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber)
      })
      .on('error', function(error, receipt) {
          console.log(error)
      });

  }


  return (
    <div className="App_body">
      <div>
      <input type="file" onChange={Upload}/>
      { _uri && (<img src={_uri} width="600px" />)}
      </div>

      <div>
        <br></br>
        <label for="to">Mint to:</label>
        <input className='inp' type="text" onChange={(e) => set_mintTo(e.target.value)}></input><br></br>
        <label for="tokenId">tokenId:</label>
        <input className='inp' type="text" onChange={(e) => setTokenId(e.target.value)}></input><br></br>
        {/* <input type="text" onChange={(e) => setUri(e.target.value)}></input> */}
        <button className='btn' onClick={Mint}>Mint</button>
      </div>
      <br></br>
      <div>
        {/* <input type="text" onChange={(e) => setFrom(e.target.value)}></input> */}
        <label for="fname">Transfer to:</label>
        <input className='inp' type="text" onChange={(e) => set_transferTo(e.target.value)}></input><br></br>
        {/* <label for="fname">tokenId:</label>
        <input type="text" onChange={(e) => setTokenId(e.target.value)}></input> */}
        <button className='btn' onClick={TransferFrom}>Transfer</button>
      </div>
      <br></br>
    </div>
  );
}

export default LoggedIn;