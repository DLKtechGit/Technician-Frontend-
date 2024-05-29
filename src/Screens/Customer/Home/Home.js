import React from 'react'
import Menus from "../../Customer/Home/Menus/Menus"
import Caroseuls from '../../../Reusable/Caroseuls'
import { Heading } from '../../../Reusable/Headings/Heading'
import OurServices from '../Services/OurServices/OurServices'
import ServiceHistory from '../Services/ServiceHistory/ServiceHistory'

const Home = () => {
    return (
        <div>
            <Menus title="Home" />
            <section>
                <Heading heading="Your Ultimate pest Control Solution start Here!"/>
            </section>
            <section>
                <Caroseuls showDots={true}/>
            </section>
            {/* <section>
                <OurServices />
            </section> */}
            <section>
                <ServiceHistory />
            </section>
        </div>
    )
}

export default Home