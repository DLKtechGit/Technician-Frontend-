import React from 'react'
import Menus from "../../Customer/Home/Menus/Menus"
import Caroseuls from '../../../Reusable/Caroseuls'
import { Heading } from '../../../Reusable/Headings/Heading'
import AllServicesHistory from '../Services/ServiceHistory/AllServicesHistory/AllServicesHistory'

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
                <AllServicesHistory/>
                {/* <ServiceHistory /> */}
            </section>
        </div>
    )
}

export default Home