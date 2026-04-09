import type { Metadata } from "next";
import { ProjectsIndexPage } from "@/components/site-pages";
import { getProjects } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Project records for boards, firmware efforts, generated artifacts, and related learning content.",
};

export default function ProjectsPage() {
  return <ProjectsIndexPage projects={getProjects()} />;
}