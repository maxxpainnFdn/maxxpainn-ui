const Divider = ({ fromHex, toHex }) => (
  <div
    className="maxx-divider"
    style={{ background: `linear-gradient(to bottom right, ${fromHex} 49.5%, ${toHex} 50%)` }}
  />
);

export default Divider;
