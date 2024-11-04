import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import BlurFade from "@/components/ui/blur-fade";
import { FadeText } from "@/components/ui/fade-text";
import { Header } from "@/components/header";

export const Route = createFileRoute("/")({
   component: HomeComponent,
});

function HomeComponent() {
   return (
      <div className="flex-1 flex flex-col bg-[url('/background/background-main.png')] bg-no-repeat bg-contain">
         <Header />
         <main className="container h-[screen] flex-1 grid gap-5 ">
            <div className="ml-auto w-3/4 h-full flex flex-col justify-center">
               <h1 className="text-[90px] font-medium uppercase float-right text-right">
                  <BlurFade delay={0.25 + 0.05}>
                     <span>The biggest</span>
                  </BlurFade>
                  <BlurFade delay={0.25 + 0.1}>
                     <span> encyclopedia of </span>
                  </BlurFade>
                  <BlurFade delay={0.25 + 0.15}>
                     <span>Slavic gods</span>
                  </BlurFade>
               </h1>
               <BlurFade delay={0.25 + 0.2}>
                  <hr className="border-t-2 border-primary w-3/4 ml-auto" />
               </BlurFade>
            </div>
            <div className="flex justify-between items-center">
               <Link
                  to="/collection"
                  search={{ name: "Veles" }}
                  className="group text-muted-foreground hover:text-accent-foreground font-bold focus:text-accent-foreground transition-colors duration-300 active:text-accent-foreground text-xl flex flex-col uppercase"
               >
                  <FadeText
                     direction="left"
                     transition={{ delay: 0.8, duration: 0.4 }}
                     framerProps={{}}
                  >
                     Find out
                  </FadeText>
                  <FadeText
                     direction="left"
                     transition={{ delay: 0.8, duration: 0.4 }}
                     framerProps={{}}
                  >
                     <span className="flex items-center">
                        more
                        <ArrowRight className="size-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                     </span>
                  </FadeText>
               </Link>
               <BlurFade delay={0.25 + 0.25}>
                  <p className="text-xl">Read it, Watch it, Chat it</p>
               </BlurFade>
            </div>
         </main>
      </div>
   );
}
