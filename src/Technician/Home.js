import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Menus from "../Screens/Customer/Home/Menus/Menus";
import { Heading } from "../Reusable/Headings/Heading";
import Caroseuls from "../Reusable/Caroseuls";
import CustomerList from './Customerllist/CustomerList';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent going back to the previous page
    const handlePopState = (event) => {
      event.preventDefault();
      window.history.pushState(null, null, window.location.href);
    };

    // Prevent page reload
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ''; // Chrome requires returnValue to be set
    };

    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [navigate]);

  return (
    <div>
      <Menus title="HOME" />
      <section>
        <Heading heading="Your Ultimate Pest Control Solution Starts Here!" />
      </section>
      <section>
        <Caroseuls showDots={true} />
      </section>
      <CustomerList />
      <section></section>
    </div>
  );
};

export default Home;
