import React, { useState, useEffect } from 'react'
import type { FC, ReactElement } from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

type SquareProps = {
  id?: number
  occurrences?: number | 0
  average: number | 0
  // color?: string
}

type SquareType = ReactElement<SquareProps>
type SquaresType = SquareType[][]

const Square: FC<SquareProps> = ({ id, occurrences = 0, average = 0 }) => {
  const chosenColorIntensity = Math.min(occurrences, 2) * 1 // sums to 1
  // const averageColorIntensity = Math.min(average, 2) * 1 // sums to 1

  const chosenColor = `rgba(252, 252, 0, ${chosenColorIntensity})`

  let averageColor: string

  average > 0 ? (averageColor = `rgba(252, 0, 252)`) : (averageColor = ``)

  let lowerLimit: number = 0
  let upperLimit: number = 0
  if (id != null) {
    lowerLimit = id * 10
    upperLimit = lowerLimit + 9
  }
  // const averageColor = `rgba(252, 0, 252)`
  // const style = {
  //   width: '10px',
  //   height: '10px',
  //   // backgroundColor: `rgba(0, 0, 255, ${colorIntensity})`,
  //   backgroundColor: `green`,
  // }

  // const lineThickness = average * 2 + 4

  return (
    <TooltipProvider delayDuration={10}>
      <Tooltip>
        <TooltipTrigger>
          <div
            className={`relative w-5 h-5 m-1 text-white border border-white`}
            style={{ backgroundColor: chosenColor }}
          >
            <div
              className="absolute opacity-50 w-5 h-5 \
      flex justify-center items-center"
              style={{ backgroundColor: averageColor }}
            >
              {/* <span className="text-black">{occurrences}</span> */}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          <div className="px-3 py-1 max-w-[240px] text-md cursor-default">
            <div>
              Range: {lowerLimit} - {upperLimit}
            </div>
            <div>No. of keys: {occurrences}</div>
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

  const numberList = useStoreState((state) => state.numberList)
  const averageList = useStoreState((state) => state.averageList)

  const [squares, setSquares] = useState<SquaresType>([])

  const rows = 50
  const columns = 50

  let rowsOfSquares: SquareType[][] = []

  const initialSquares = () => {
    let numberArray: SquareType[] = []
    for (let i = 0; i < 1000; i++) {
      numberArray.push(<Square key={i} id={i} occurrences={0} average={0} />)
    }
    rowsOfSquares = chunkArray(numberArray, columns)
    setSquares(rowsOfSquares)
  }

  useEffect(() => {
    initialSquares()
    // numberRun()
  }, [])

  console.log(numberList)
  let adjNumberList: number[] = []
  for (let i = 0; i < numberList.length; i++) {
    adjNumberList[i] = Math.floor(numberList[i] / 10)
  }

  console.log(averageList)

  let adjAverageList: number[] = []
  for (let i = 0; i < averageList.length; i++) {
    adjAverageList[i] = Math.floor(averageList[i] / 10)
  }

  const clearSquares = () => {
    initialSquares()
  }

  const [buttonState, setButtonState] = useState<string>('')

  const numberRun = async () => {
    setButtonState('running')
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
          }
        }
        setSquares([...squares]) // Trigger re-render
      }
      if (index < adjAverageList.length) {
        const avgNumber = adjAverageList[index]
        for (let i = 0; i < squares.length; i++) {
          for (let j = 0; j < squares[i].length; j++) {
            const square = squares[i][j]
            if (Number(square.key) === avgNumber) {
              // const updatedSquare = <FlashingSquare>{square}</FlashingSquare>

              const updatedSquare = React.cloneElement(square, {
                average: (square.props.average || 0) + 1,
              })

              squares[i][j] = updatedSquare
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

    setButtonState('done')
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center text-3xl">Catching the average</DialogTitle>
        <DialogDescription className="text-center text-2xl">
          <div className="flex gap-4">
            <span>Current average: {currentAverage}</span>
            <span>Total number: {totalNumber}</span>
            <span>Total bought: {ticketsBought}</span>
          </div>
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col justify-center items-center overflow-auto">
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
      </div>

      <div className="text-center text-2xl">🟡 Chosen numbers 🟣 Average</div>

      <div className="flex">
        <Button
          variant="average"
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
          variant="average"
          onClick={() => clearSquares()}
          className="flex flex-col items-center \
      rounded-lg px-6 mx-2"
        >
          Reset
        </Button>
      </div>
    </>
  )
}

export default Grid
