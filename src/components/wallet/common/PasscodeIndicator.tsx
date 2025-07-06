interface PasscodeIndicatorProps {
  length: number
}

export const PasscodeIndicator = ({ passcode }: { passcode: string }) => {
  return (
    <div className="flex gap-4 justify-center mb-8">
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          className={`w-4 h-4 rounded-full border-2 ${
            index < passcode.length ? "bg-white border-white" : "border-gray-500"
          }`}
        />
      ))}
    </div>
  )
}