declare module 'parliament-svg' {
  interface PartyData {
    seats: number
    colour: string
  }

  interface ParliamentOptions {
    seatCount?: boolean
    hFunction?: Function
  }

  function parliamentSVG(
    parties: Record<string, PartyData>,
    options?: ParliamentOptions
  ): any

  export default parliamentSVG
} 