import { Card, CardContent } from "../../ui/card"
import { Button } from "../../ui/button";
import { useAuth } from '../../../context/AuthContext';
import { LandingScreenProps, Screen } from "../../../lib/types";



export const LandingScreen = ({ setCurrentScreen, onCreateWallet, onImportWallet }: LandingScreenProps) => {
  const { hasPasscode } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
        <CardContent className="p-8 text-center text-white">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg"></div>
            </div>
            <h1 className="text-2xl font-bold mb-2">Trust Wallet</h1>
            <p className="text-white/80">Your gateway to the decentralized web</p>
          </div>
          <div className="space-y-4">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={onCreateWallet}
            >
              Create a new wallet
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-white/30 text-white hover:bg-white/10"
              onClick={onImportWallet}
            >
              I already have a wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}