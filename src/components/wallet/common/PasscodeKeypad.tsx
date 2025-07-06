import { Button } from "../../ui/button";

export const PasscodeKeypad = ({ handlePasscodeInput }: { handlePasscodeInput: (digit: string) => void }) => {
  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-xs mx-auto">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <Button
          key={num}
          variant="ghost"
          size="lg"
          className="h-16 w-16 rounded-full bg-gray-800 hover:bg-gray-700 text-white text-xl font-medium"
          onClick={() => handlePasscodeInput(num.toString())}
        >
          {num}
        </Button>
      ))}
      <Button variant="ghost" size="lg" className="h-16 w-16 rounded-full bg-gray-800 hover:bg-gray-700 text-white">
        🎧
      </Button>
      <Button
        variant="ghost"
        size="lg"
        className="h-16 w-16 rounded-full bg-gray-800 hover:bg-gray-700 text-white text-xl font-medium"
        onClick={() => handlePasscodeInput("0")}
      >
        0
      </Button>
      <Button
        variant="ghost"
        size="lg"
        className="h-16 w-16 rounded-full bg-gray-800 hover:bg-gray-700 text-white text-xl"
        onClick={() => handlePasscodeInput("delete")}
      >
        ×
      </Button>
    </div>
  )
}