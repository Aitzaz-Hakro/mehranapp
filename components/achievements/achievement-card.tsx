import Image from "next/image";

import type { Achievement } from "@/types/database";

export function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <article className="rounded-lg border border-[#002147]/12 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-[#002147]/10 bg-[#f3f6fb]">
          <Image
            src={achievement.photo_url}
            alt={`${achievement.student_name} profile`}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-[#002147]">{achievement.student_name}</h3>
          <p className="text-sm text-black/70">{achievement.department}</p>
        </div>
      </div>

      <h4 className="mt-4 text-sm font-semibold text-black">{achievement.achievement_title}</h4>
      <p className="mt-2 text-sm leading-6 text-black/75">{achievement.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {achievement.linkedin_link ? (
          <a
            href={achievement.linkedin_link}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-[#002147]/20 px-3 py-1.5 text-xs font-semibold text-[#002147] hover:bg-[#f3f6fb]"
          >
            LinkedIn
          </a>
        ) : null}
        {achievement.github_link ? (
          <a
            href={achievement.github_link}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-[#002147]/20 px-3 py-1.5 text-xs font-semibold text-[#002147] hover:bg-[#f3f6fb]"
          >
            GitHub
          </a>
        ) : null}
      </div>
    </article>
  );
}
