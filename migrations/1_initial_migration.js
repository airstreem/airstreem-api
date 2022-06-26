const { web3tx } = require("@decentral.ee/web3-helpers")
const { setWeb3Provider } = require("@decentral.ee/web3-helpers/src/config")
const NativeSuperToken = artifacts.require("NativeSuperToken");

// Why is mainnet not here ?
const factory = {
  1: "0x2C90719f25B10Fc5646c82DA3240C76Fa5BcCF34",
  100: "0x23410e2659380784498509698ed70E414D384880",
  10: "0x8276469A443D5C6B7146BED45e2abCaD3B6adad9",
  42161: "0x1C21Ead77fd45C84a4c916Db7A6635D0C6FF09D6",
  5: "0x94f26B4c8AD12B18c12f38E878618f7664bdcCE2",
  42: "0xF5F666AC8F581bAef8dC36C7C8828303Bd4F8561",
  4: "0xd465e36e607d493cd4CC1e83bea275712BECd5E0",
  421611: "0xc11eC618c1d559705E853741e366663Fe9302362",
  3: "0x6FA165d10b907592779301C23C8Ac9d1F79ca930",
  80001: "0x200657E2f123761662567A1744f9ACAe50dF47E6",
  69: "0xB5f0501908ca8A99fD31bEFCAc1cA458F3588671",
  43113: "0xA25dbEa94C5824892006b30a629213E7Bf238624",
  137: "0x2C90719f25B10Fc5646c82DA3240C76Fa5BcCF34"
}


module.exports = async function (callback) {
  const name = process.env.name ? process.env.name : "AirStream Token"
  const symbol = process.env.symbol ? process.env.symbol : "asAST"

  try {
    setWeb3Provider(web3.currentProvider)

    const chainId = await web3.eth.net.getId()
    const superTokenFactory = factory[chainId]
    const amount = process.env.amount ? process.env.amount : "10000000000000000000000"
    const tokenReceiver = process.env.receiver ? process.env.receiver : "0x83a992a3b80a41c8dac08be00adb495f7836df30"

    const token = await web3tx(
        NativeSuperToken.new,
        `Deploy NativeSuperToken contract`
    )()

    console.log(`Deployed at: ${token.address}`)

    await web3tx(
        token.initialize,
        "Initialize NativeSuperToken contract"
    )(name, symbol, superTokenFactory,
        tokenReceiver,
        amount
    )
  } catch (error) {
    console.error(error)
  }

  if (typeof callback === 'function') {
    return callback()
  }
}
