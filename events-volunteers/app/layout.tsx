import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Nami Events & Volunteers',description:'Private event and volunteer coordination evaluation prototype'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
