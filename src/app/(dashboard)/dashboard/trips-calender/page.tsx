import TripCalendar from "./components/TripCalendar";

export default function Page() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Trips Calendar</h1>
        <p className="text-gray-600">
          Manage and view all your upcoming trips in one place.
        </p>
      </div>

      <TripCalendar />
    </div>
  );
}
