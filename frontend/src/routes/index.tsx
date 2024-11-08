import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import BlurFade from "@/components/ui/blur-fade";
import { FadeText } from "@/components/ui/fade-text";
import { Header } from "@/components/header";

export const Route = createFileRoute("/")({
   component: HomeComponent,
});

function HomeComponent() {
   return (
      <div className="flex-1 flex flex-col bg-[url('/background/background-main.png')] bg-no-repeat bg-cover bg-[-40vw_center] md:bg-[0vw_center]  2xl:bg-contain">
         <Header />
         <main className="container h-[screen] flex-1 grid gap-5 ">
            <div className="md:ml-auto gap-8 lg:w-3/4 h-full flex flex-col justify-center">
               <h1 className="float-left text-[10vw] md:text-[70px] xl:text-[90px] md:font-medium uppercase md:float-right md:text-right">
                  <BlurFade delay={0.25 + 0.05}>
                     <span>The biggest</span>
                  </BlurFade>
                  <BlurFade delay={0.25 + 0.1}>
                     <span>
                        {" "}
                        encyclopedia{" "}
                        <span className="hidden md:inline-block">of</span>
                     </span>
                  </BlurFade>
                  <BlurFade delay={0.25 + 0.15}>
                     <span>Slavic gods</span>
                  </BlurFade>
               </h1>
               <BlurFade delay={0.25 + 0.2}>
                  <hr className="border-t-[3px] border-primary w-3/4 md:ml-auto" />
               </BlurFade>
               <BlurFade delay={0.25 + 0.25} className="md:hidden">
                  <p className="text-md">Read it, Watch it, Chat it</p>
               </BlurFade>
            </div>
            <div className="flex justify-between items-center">
               <Link
                  to={`/collection/${"Veles"}` as any}
                  className="ml-auto md:ml-0 group text-muted-foreground hover:text-accent-foreground font-bold focus:text-accent-foreground transition-colors duration-300 active:text-accent-foreground text-xl flex flex-col uppercase"
               >
                  <FadeText
                     direction="left"
                     transition={{ delay: 0.8, duration: 0.4 }}
                     framerProps={{}}
                     className="flex gap-2"
                  >
                     Find out
                     <span className="flex items-center md:hidden">
                        more
                        <ArrowRight className="size-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                     </span>
                  </FadeText>
                  <FadeText
                     direction="left"
                     transition={{ delay: 0.8, duration: 0.4 }}
                     framerProps={{}}
                  >
                     <span className="items-center hidden md:flex">
                        more
                        <ArrowRight className="size-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                     </span>
                  </FadeText>
               </Link>
               <BlurFade delay={0.25 + 0.25} className="hidden md:inline-block">
                  <p className="text-xl">Read it, Watch it, Chat it</p>
               </BlurFade>
            </div>
         </main>
      </div>
   );
}
