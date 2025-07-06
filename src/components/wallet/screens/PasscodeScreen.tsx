import { Button } from "../../ui/button";
import { ArrowLeft } from "lucide-react"
import { PasscodeKeypad } from "../common/PasscodeKeypad"
import { PasscodeIndicator } from "../common/PasscodeIndicator"
import { PasscodeScreenProps, Screen } from "@/src/lib/types"

export const PasscodeScreen = ({
  type,
  passcode,
  setPasscode,
  confirmPasscode = "",
  setConfirmPasscode = () => {},
  onBack,
  onContinue,
  setCurrentScreen,
  isLoading = false,
  error = "",
}: PasscodeScreenProps) => {
  const handlePasscodeInput = (digit: string) => {
    if (isLoading) return;

    if (digit === "delete") {
      if (type === "confirm") {
        setConfirmPasscode(confirmPasscode.slice(0, -1));
      } else {
        setPasscode(passcode.slice(0, -1));
      }
    } else if ((type === "confirm" ? confirmPasscode : passcode).length < 4) {
      if (type === "confirm") {
        setConfirmPasscode(confirmPasscode + digit);
      } else {
        setPasscode(passcode + digit);
      }
    }
  }

  const handleContinue = () => {
    if (isLoading) return;

    if (type === "set" && passcode.length === 4) {
      setCurrentScreen("confirm-passcode");
    } else if (type === "confirm" && confirmPasscode.length === 4) {
      onContinue();
    } else if (type === "enter" && passcode.length === 4) {
      onContinue();
    }
  }

  const handleBack = () => {
    if (isLoading) return;

    if (type === "set") {
      setCurrentScreen("landing");
    } else if (type === "confirm") {
      setCurrentScreen("set-passcode");
      setConfirmPasscode("");
    } else {
      onBack();
    }
  }

  // Determine which passcode to show in indicator
  const currentPasscode = type === "confirm" ? confirmPasscode : passcode;
  const isComplete = type === "confirm" ? confirmPasscode.length === 4 : passcode.length === 4;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-md mx-auto">
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 text-red-200 text-sm">
            {error}
          </div>
        )}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-800"
            onClick={handleBack}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <span className="ml-4 text-lg">Back</span>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold mb-4">
            {type === "set" ? "Set passcode" : type === "confirm" ? "Confirm passcode" : "Enter your passcode"}
          </h1>
          {(type === "set" || type === "confirm") && (
            <p className="text-gray-400 text-sm leading-relaxed">
              Secure your digital assets. Set a four-digit passcode that you can easily remember. This code will be
              required to access your wallet every time you log in
            </p>
          )}
        </div>

        <PasscodeIndicator passcode={currentPasscode} />

        <div className="text-center mb-8">
          <p className="text-gray-400 text-sm">
            Passcode adds an extra layer of security when using wallet recovery
          </p>
        </div>

        <PasscodeKeypad handlePasscodeInput={handlePasscodeInput} />

        {isComplete && (
          <div className="mt-8">
            <Button
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
              onClick={handleContinue}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Continue"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}