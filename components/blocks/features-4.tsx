import { Cpu, Fingerprint, Pencil, Settings2, Sparkles, Zap } from 'lucide-react'

export function Features() {
    return (
        <section className="py-12 md:py-20">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="text-balance text-4xl font-medium lg:text-5xl">Stop exploitable vulnerabilities before they happen</h2>
                    <p>Firmeware is unique, once a vulnerability is introduced, it's hard to reel it back in. Nabla helps you not get to that spot.</p>
                </div>

                <div className="relative mx-auto grid max-w-2xl lg:max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Zap className="size-4" />
                            <h3 className="text-sm font-medium">Faaast</h3>
                        </div>
                        <p className="text-sm">Rust based system allows firmware builds to happen fast</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Cpu className="size-4" />
                            <h3 className="text-sm font-medium">Semi-deterministic</h3>
                        </div>
                        <p className="text-sm">The OSS tools we use enable a slight bit of determinism into the process</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Fingerprint className="size-4" />

                            <h3 className="text-sm font-medium">Security</h3>
                        </div>
                        <p className="text-sm">Firmware security is often overlooked. We want to help address that. </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Pencil className="size-4" />

                            <h3 className="text-sm font-medium">SBOMS</h3>
                        </div>
                        <p className="text-sm">We allow you to generate SBOMs and attestations from your firmware builds.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Settings2 className="size-4" />

                            <h3 className="text-sm font-medium">Integrity</h3>
                        </div>
                        <p className="text-sm">We help you secure your software supply chain for long term integrity</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4" />

                            <h3 className="text-sm font-medium">Context-driven LLM magic</h3>
                        </div>
                        <p className="text-sm">Rules-based engines + LLMs = Firmware Security Ops</p>
                    </div>
                </div>
            </div>
        </section>
    )
}