import {
  IntroSlides,
  type IntroSlide,
} from "@/components/onboarding/IntroSlides";
import { onboardingImages } from "@/constants/onboardingImages";
import { useStatusBar } from "@/lib/useStatusBar";
import { useRouter } from "expo-router";

const SLIDES: IntroSlide[] = [
  {
    image: onboardingImages.customer[0],
    title: "Find the right technician",
    description:
      "Plumbers, electricians, cleaners and more. Every technician is reviewed and approved before they take a job.",
  },
  {
    image: onboardingImages.customer[1],
    title: "Book and approve a quote",
    description:
      "Describe the problem, pick a time, and see a clear price before any work starts.",
  },
  {
    image: onboardingImages.customer[2],
    title: "Follow your job",
    description:
      "See when your technician is on the way, and rate the work when it is done.",
  },
];

export default function CustomerIntro() {
  const router = useRouter();
  useStatusBar("light");

  return (
    <IntroSlides
      slides={SLIDES}
      finishLabel="Create an account"
      onDone={() => router.replace("/customer/signup")}
    />
  );
}
