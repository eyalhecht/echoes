export default function LoadingScreen() {
    return (
        <div
            className="fixed inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-stone-100 via-stone-200 to-amber-50 dark:from-stone-900 dark:via-stone-800 dark:to-stone-700">
            <div
                className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20 dark:to-black/40"></div>
            <div className="relative z-10 text-center space-y-8">
                <h1 className="text-6xl md:text-8xl font-bold text-stone-800 dark:text-stone-200 drop-shadow-lg" style={{ fontFamily: "'Lora', Georgia, serif", letterSpacing: '-0.02em' }}>
                    Echoes
                </h1>
            </div>
        </div>
    );
}