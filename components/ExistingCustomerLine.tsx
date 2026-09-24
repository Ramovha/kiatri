// For people who already have a Kiatri line: extras are added from the client
// area, where they only see the ones their service qualifies for.
export default function ExistingCustomerLine({ className = '' }: { className?: string }) {
  return (
    <p className={`text-center text-sm text-navy-700 ${className}`}>
      Already with Kiatri?{' '}
      <a href="https://calling.kiatri.com/cart.php?gid=addons" className="font-semibold text-ember-600 hover:text-ember-500">
        Add extras to your line from your client area →
      </a>
    </p>
  );
}
