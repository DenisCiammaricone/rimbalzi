import { auth } from "@/auth";
import { isResearcher } from "@/app/lib/utils";
import { redirect } from "next/navigation";

export default async function SessionsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const userIsResearcher = await isResearcher();

    // Redirect to login if not logged in or not a researcher
    if (!session || !userIsResearcher) {
        redirect("/login");
    }

    return (
        <div className="w-full" id="fronting">
            <div className="container mx-auto p-4" >
                {children}
            </div>
        </div>
    );
}
