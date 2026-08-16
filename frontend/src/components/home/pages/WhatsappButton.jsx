import { WhatsApp } from "@mui/icons-material"
import { Link } from "react-router-dom"

const WhatsappButton = () => {
    const whatsappLink = "https://wa.me/447393153454"

    return (
        <div className="fixed bottom-24 left-5 w-24 h-12 z-30 rounded-full bg-gradient-to-tr from-green-600 to-green-900 flex items-center px-1">
            <Link to={whatsappLink} className="flex items-center justify-between w-full ">
                <span className="tracking-tighter text-nowrap text-white font-semibold">Chat</span>
                <span className="bg-gradient-to-tr from-green-400 to-green-700 w-10 h-10 rounded-full flex items-center justify-center">

                <WhatsApp style={{color: 'white'}} />
                </span>
            </Link>
        </div>
    )
}

export default WhatsappButton