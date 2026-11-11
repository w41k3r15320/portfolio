import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectView } from "@/components/sites/dang/ProjectView";
import { getProject, projects } from "@/components/sites/dang/projects";

export const dynamicParams = false;

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return {};

  return {
    title: project.title,
    description: `${project.title} — ${project.disciplines.join(
      ", ",
    )} by Tran Huy Dang.`,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  return <ProjectView project={project} />;
}
