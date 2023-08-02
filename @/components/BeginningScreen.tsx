import CustomConnectButton from './ui/connect-button';

export default function BeginningScreen() {
  return (
    <div className="max-w-lg mx-auto mt-[26px]">
      <div className="text-center">
        <p className="text-lg">Round 01</p>
        <p className="text-lg">Beginnings</p>
        <h1 className="uppercase mt-4 text-xl">are you the last man standing?</h1>
      </div>

      <div className="mx-auto flex justify-center mt-20">
        <CustomConnectButton />
      </div>
    </div>
  );
}
