import od from "@/app/images/onduty-icon.png"
import Image from "next/image"

const Logoheader = ({title} : { title: string;}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-5 font-bold text-2xl text-(--color-primary)">
      <Image src={od} width={100} alt="Onduty Logo"/>
      {title}
    </div>
  )
}

export default Logoheader
