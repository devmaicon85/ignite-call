export interface MultiStepProps {
    size: number;
    currentStep?: number;
}

export function MultiStep({ size, currentStep = 1 }: MultiStepProps) {
    return (
        <div className="flex w-full flex-col">
            <div>
                <label className="text-gray-200">
                    Passo {currentStep} de {size}
                </label>
            </div>

            <div className={`flex gap-1 w-full`}>
                {Array.from({ length: size }, (k, i) => i + 1).map((step) => {
                    return (
                        <div
                            className={`h-2 w-full rounded-md bg-gray-200 ${
                                currentStep >= step && "bg-red-900"
                            }`}
                            key={step}
                        ></div>
                    );
                })}
            </div>
        </div>
    );
}
