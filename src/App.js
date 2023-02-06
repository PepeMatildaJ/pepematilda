import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'

// ABIs
import PepeMatilda from './abis/PepeMatilda.json'

// Config
import config from './config.json'

function App() {
  const[provider, setProvider] = useState(null)
  const[pepematilda, setPepeMatilda] = useState(null)

  const[account, setAccount] = useState(null)

  const[anillos, setAnillos] = useState(null)
  const[collares, setCollares] = useState(null)
  const[aretes, setAretes] = useState(null)

  const [item, setItem] = useState({})

  const [toggle, setToggle] = useState(false)

  const togglePop = (item) => {
    setItem(item)
    toggle ? setToggle(false) : setToggle(true)
  }

  const loadBloackchainData = async () => {
    //connect blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    

    const network = await provider.getNetwork()
    console.log(network)

    const pepematilda = new ethers.Contract( 
      config[network.chainId].pepematilda.address,
      PepeMatilda, 
      provider 
    )
    setPepeMatilda(pepematilda)
    
    

     //loadproducts

     const items = []

     for (var i = 0; i < 9; i++) {
      const item = await pepematilda.items(i + 1)
      items.push(item)
     }

    const anillos = items.filter((item) => item.category === 'anillos')
    const collares = items.filter((item) => item.category === 'collares')
    const aretes = items.filter((item) => item.category === 'aretes')

    setAnillos(anillos)
    setCollares(collares)
    setAretes(aretes)
  }


  useEffect(() => {
    loadBloackchainData()
  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />

      <h2>PepeMatilda</h2>

      {anillos && collares && aretes && ( <>
            <Section title="Anillos" items={anillos} togglePop={togglePop} />
            <Section title="Collares" items={collares} togglePop={togglePop} />
            <Section title="Aretes" items={aretes} togglePop={togglePop} />
            </>
      )}

        {toggle && (
          <Product item={item} provider={provider} account={account} pepematilda={pepematilda} togglePop={togglePop} />
        )}
     

    </div>
  );
}

export default App;
