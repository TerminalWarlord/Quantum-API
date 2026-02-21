import Footer from "@/components/layout/footer";

export default function Layout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return <>
        {children}
        <Footer/>
    </>
}