const SectionTitle = ({ heading, subHeading }) => {
  return (
    <div className="my-10 text-center">
      <p className="text-xl text-orange-500">{subHeading}</p>
      <h2 className="inline-block pb-2 text-4xl font-bold uppercase border-b-4 border-orange-500">
        {heading}
      </h2>
    </div>
  );
};

export default SectionTitle;
