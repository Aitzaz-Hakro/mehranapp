import { LoginForm } from "@/components/auth/login-form";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const nextPath = typeof params?.next === "string" ? params.next : "/";

  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center px-4 py-10">
      <LoginForm nextPath={nextPath} />
    </section>
  );
}
