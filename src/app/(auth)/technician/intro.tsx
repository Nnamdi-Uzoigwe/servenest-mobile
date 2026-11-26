import {
    IntroSlides,
    type IntroSlide,
} from "@/components/onboarding/IntroSlides";
import { onboardingImages } from "@/constants/onboardingImages";
import { useStatusBar } from "@/lib/useStatusBar";
import { useRouter } from "expo-router";

const SLIDES: IntroSlide[] = [
  {
    image: onboardingImages.technician[0],
    title: "Join a vetted network",
    description:
      "Apply once. Our team reviews your details and documents, then you can start taking jobs.",
  },
  {
    image: onboardingImages.technician[1],
    title: "Take jobs near you",
    description:
      "Get assignments for the areas and days you choose. Accept or decline, then update each job as you go.",
  },
  {
    image: onboardingImages.technician[2],
    title: "Track what you earn",
    description:
      "See completed jobs, pending payouts and your payment history in one place.",
  },
];

export default function TechnicianIntro() {
  const router = useRouter();
  useStatusBar("light");

  return (
    <IntroSlides
      slides={SLIDES}
      finishLabel="Start my application"
      onDone={() => router.replace("/technician/signup")}
    />
  );
}
