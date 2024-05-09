import React, { useState, useEffect } from 'react'
import type { FC, ReactElement } from 'react'
import { Button } from '../shadcn/button'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/shadcn/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import { useStoreActions, useStoreDispatch, useStoreState } from '../../../store'
import { useReadContracts, useWatchContractEvent } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import { useWindowSize } from '../../../hooks/useWindowSize'

type SquareProps = {
  id?: number
  occurrences?: number | 0
  average: number | 0
  last?: boolean
  first?: boolean
}

type SquareType = ReactElement<SquareProps>
type SquaresType = SquareType[][]

const Square: FC<SquareProps> = ({ id, occurrences = 0, average = 0, last, first }) => {
  const chosenColorIntensity = occurrences * 1 // sums to 1
  // const averageColorIntensity = Math.min(average, 2) * 1 // sums to 1

  // purple
  const chosenColor = `rgba(168, 85, 247, ${chosenColorIntensity})`

  // let averageColor: string
  // const lastColor: string = 'rgb(220, 38, 38)'
  // yellow

  // average > 0 ? (averageColor = `rgb(253, 224, 71)`) : (averageColor = ``)

  const averageColor: string = `rgb(253, 224, 71)`
  const lastColor: string = 'rgb(220, 38, 38)'
  const firstColor: string = 'rgb(240, 141, 15)'
  const firstAndLastColor: string = 'rgb(20, 23, 13)'

  let nextColor: string = ''

  if (average > 0) {
    nextColor = averageColor
  }

  if (first) {
    nextColor = firstColor
  }

  if (last) {
    nextColor = lastColor
  }

  if (first && last) {
    nextColor = firstAndLastColor
  }

  // average > 0 && last === true ? (averageColor = `rgb(253, 131, 13)`) : (averageColor = ``)
  // last && average > 0 ? (averageColor = `rgb(253, 131, 13)`) : (averageColor = ``)

  /* if 1 square = a range
  let lowerLimit: number = 0
  let upperLimit: number = 0
  if (id != null) {
    lowerLimit = id * 10
    upperLimit = lowerLimit + 9
  }
  */

  return (
    <TooltipProvider delayDuration={10}>
      <Tooltip>
        <TooltipTrigger>
          <div
            className={`relative w-5 h-5 m-1 border-white border text-white`}
            style={{ backgroundColor: chosenColor }}
          >
            <div
              className="absolute w-5 h-5 mix-blend-hue \
      flex justify-center items-center"
              style={{ backgroundColor: nextColor }}
            >
              {/* <span className="text-black">{occurrences}</span> */}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          <div className="px-3 py-1 text-center max-w-[240px] text-md cursor-default">
            <div>
              <span className="text-sm mr-1">#️⃣</span>
              {/* Range: {lowerLimit} - {upperLimit} */}
              {id}
            </div>
            <div>
              {occurrences == 1 ? (
                <span>{occurrences} disk bought</span>
              ) : (
                <span>{occurrences} disks bought</span>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const chunkArray = (array: SquareType[], size: number): SquareType[][] => {
  const chunkedArray = []
  for (let i = 0; i < array.length; i += size) {
    chunkedArray.push(array.slice(i, i + size))
  }
  return chunkedArray
}

const Grid = () => {
  /* read contract
  const { data, refetch } = useReadContracts({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'currentAverage',
      },
      {
        ...defaultContractObj,
        functionName: 'totalNumber',
      },
      {
        ...defaultContractObj,
        functionName: 'ticketIdCounter',
      },
    ],
  })

  const currentAverage = Number(data?.[0].result || BigInt(0))
  const totalNumber = Number(data?.[1].result || BigInt(0))
  const ticketsBought = Number(data?.[2].result || BigInt(0))

  */
  const firstNumber = useStoreState((state) => state.firstNumber)

  const numberList = useStoreState((state) => state.numberList)
  const averageList = useStoreState((state) => state.averageList)

  const currentAverage = useStoreState((state) => state.currentAverage)
  const totalNumber = useStoreState((state) => state.totalNumber)
  const ticketsBought = useStoreState((state) => state.ticketsBought)
  const leaderboard = useStoreState((state) => state.leaderboard)
  const minAllowedNumber = useStoreState((state) => state.minAllowedNumber)
  const maxAllowedNumber = useStoreState((state) => state.maxAllowedNumber)

  const [squares, setSquares] = useState<SquaresType>([])

  // const rows = 50
  let columns: number
  maxAllowedNumber > 100 ? (columns = 50) : (columns = 10)

  let rowsOfSquares: SquareType[][] = []

  const initialSquares = () => {
    let numberArray: SquareType[] = []
    for (let i = 0; i <= maxAllowedNumber; i++) {
      numberArray.push(<Square key={i} id={i} occurrences={0} average={0} />)
    }
    rowsOfSquares = chunkArray(numberArray, columns)
    setSquares(rowsOfSquares)
  }

  useEffect(() => {
    initialSquares()
    // numberRun()
  }, [])

  // console.log(numberList)

  // adjusted numberList back to 1
  let adjNumberList: number[] = []
  for (let i = 0; i < numberList.length; i++) {
    adjNumberList[i] = Math.floor(numberList[i] / 1)
  }

  // console.log(averageList)

  // adjusted averageList back to 1
  let adjAverageList: number[] = []
  for (let i = 0; i < averageList.length; i++) {
    adjAverageList[i] = Math.floor(averageList[i] / 1)
  }

  const clearSquares = () => {
    initialSquares()
  }

  // const [buttonState, setButtonState] = useState<string>('')

  const numberRun = async () => {
    // setButtonState('running')
    let index = 0
    const intervalId = setInterval(() => {
      if (index < adjNumberList.length) {
        const number = adjNumberList[index]
        for (let i = 0; i < squares.length; i++) {
          for (let j = 0; j < squares[i].length; j++) {
            const square = squares[i][j]
            if (Number(square.key) === number) {
              const updatedSquare = React.cloneElement(square, {
                occurrences: (square.props.occurrences || 0) + 1,
              })
              squares[i][j] = updatedSquare
            }
            if (Number(square.key) === firstNumber) {
              const firstSquare = React.cloneElement(square, {
                occurrences: square.props.occurrences || 0,
              })
              squares[i][j] = firstSquare
            }
          }
        }
        setSquares([...squares]) // Trigger re-render
      }
      if (index < adjAverageList.length) {
        const avgNumber = adjAverageList[index]
        const lastAvgNumber = adjAverageList[adjAverageList.length - 1]

        for (let i = 0; i < squares.length; i++) {
          for (let j = 0; j < squares[i].length; j++) {
            const square = squares[i][j]
            if (Number(square.key) === avgNumber) {
              // const updatedSquare = <FlashingSquare>{square}</FlashingSquare>

              const updatedSquare = React.cloneElement(square, {
                average: (square.props.average || 0) + 1,
              })
              squares[i][j] = updatedSquare
            } else if (Number(square.key) === firstNumber) {
              const firstSquare = React.cloneElement(square, {
                first: true,
              })
              squares[i][j] = firstSquare
            } else if (Number(square.key) === lastAvgNumber) {
              const lastSquare = React.cloneElement(square, {
                last: true,
              })
              squares[i][j] = lastSquare
            }
          }
        }

        setSquares([...squares]) // Trigger re-render
      }

      index++
      if (index >= adjNumberList.length && index >= adjAverageList.length) {
        clearInterval(intervalId) // Stop the interval when all numbers are processed
      }
    }, 100) // Adjust the delay (in milliseconds) as needed

    // setButtonState('done')
  }

  const { xs } = useWindowSize()

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center text-3xl">Catching the average</DialogTitle>
        <DialogDescription className="text-center text-2xl">
          <p className="flex flex-col justify-center sm:flex-row gap-4">
            <span>Current average: {currentAverage}</span>
            <span>Total number: {totalNumber}</span>
            <span>Total bought: {ticketsBought}</span>
          </p>

          <div className="my-4 flex flex-col items-center justify-center">
            <div className="text-yellow-500 ">Winning disk id </div>
            <div
              className="text-yellow-400  \
            text-4xl \
            flex justify-center items-center overflow-auto max-w-[480px]"
            >
              {leaderboard.map((number, index) => (
                <span className="border px-3 border-stone-500" key={index}>
                  {number}
                </span>
              ))}
            </div>
          </div>

          <div className="my-4 flex flex-col justify-center items-center overflow-auto">
            {xs ? (
              <div className="my-20 border border-white p-10">View on desktop</div>
            ) : (
              <>
                {squares.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex">
                    {row.map((item, columnIndex) => (
                      <div key={columnIndex} className="">
                        {item}
                      </div>
                    ))}
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="my-4 text-center text-base sm:text-2xl">
            {' '}
            🟣 # Picked 🟡 Average 🔴 Current Avg 🟠 First #{' '}
          </div>
          {xs ? (
            <></>
          ) : (
            <div className="flex justify-center">
              <Button
                variant="run"
                onClick={() => numberRun()}
                className={cn(
                  // buttonState === 'running' ? '' : '',
                  'flex flex-col items-center \
            rounded-lg px-6 mr-2',
                )}
              >
                Run
              </Button>

              <Button
                variant="reset"
                onClick={() => clearSquares()}
                className="flex flex-col items-center \
          rounded-lg px-6 mx-2"
              >
                Reset
              </Button>

              <DialogClose asChild>
                <Button
                  type="button"
                  variant="reset"
                  className="flex flex-col items-center \
                  rounded-lg px-6 mx-2"
                >
                  Close
                </Button>
              </DialogClose>
            </div>
          )}
        </DialogDescription>
      </DialogHeader>
    </>
  )
}

export default Grid
