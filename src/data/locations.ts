export interface CityOption {
  city: string;
  state?: string;
}

export interface CountryData {
  country: string;
  code: string;
  continent: string;
  cities: CityOption[];
}

export const WORLD_LOCATIONS: CountryData[] = [
  // INDIA
  {
    country: 'India',
    code: 'IN',
    continent: 'Asia',
    cities: [
      { city: 'Mumbai', state: 'Maharashtra' },
      { city: 'Pune', state: 'Maharashtra' },
      { city: 'Nagpur', state: 'Maharashtra' },
      { city: 'Delhi / New Delhi', state: 'Delhi NCR' },
      { city: 'Noida', state: 'Uttar Pradesh' },
      { city: 'Lucknow', state: 'Uttar Pradesh' },
      { city: 'Kanpur', state: 'Uttar Pradesh' },
      { city: 'Varanasi', state: 'Uttar Pradesh' },
      { city: 'Bengaluru', state: 'Karnataka' },
      { city: 'Mysuru', state: 'Karnataka' },
      { city: 'Hyderabad', state: 'Telangana' },
      { city: 'Chennai', state: 'Tamil Nadu' },
      { city: 'Coimbatore', state: 'Tamil Nadu' },
      { city: 'Kolkata', state: 'West Bengal' },
      { city: 'Siliguri', state: 'West Bengal' },
      { city: 'Ahmedabad', state: 'Gujarat' },
      { city: 'Surat', state: 'Gujarat' },
      { city: 'Jaipur', state: 'Rajasthan' },
      { city: 'Chandigarh', state: 'Punjab / Haryana' },
      { city: 'Indore', state: 'Madhya Pradesh' },
      { city: 'Bhopal', state: 'Madhya Pradesh' },
      { city: 'Patna', state: 'Bihar' },
      { city: 'Ranchi', state: 'Jharkhand' },
      { city: 'Bhubaneswar', state: 'Odisha' },
      { city: 'Guwahati', state: 'Assam' },
      { city: 'Kochi', state: 'Kerala' },
      { city: 'Dehradun', state: 'Uttarakhand' },
      { city: 'Goa', state: 'Goa' },
    ],
  },
  // UNITED STATES
  {
    country: 'United States',
    code: 'US',
    continent: 'North America',
    cities: [
      { city: 'New York City', state: 'New York' },
      { city: 'Los Angeles', state: 'California' },
      { city: 'San Francisco', state: 'California' },
      { city: 'San Diego', state: 'California' },
      { city: 'Chicago', state: 'Illinois' },
      { city: 'Houston', state: 'Texas' },
      { city: 'Austin', state: 'Texas' },
      { city: 'Dallas', state: 'Texas' },
      { city: 'Miami', state: 'Florida' },
      { city: 'Orlando', state: 'Florida' },
      { city: 'Seattle', state: 'Washington' },
      { city: 'Boston', state: 'Massachusetts' },
      { city: 'Atlanta', state: 'Georgia' },
      { city: 'Denver', state: 'Colorado' },
      { city: 'Las Vegas', state: 'Nevada' },
      { city: 'Washington', state: 'D.C.' },
    ],
  },
  // UNITED KINGDOM
  {
    country: 'United Kingdom',
    code: 'GB',
    continent: 'Europe',
    cities: [
      { city: 'London', state: 'England' },
      { city: 'Manchester', state: 'England' },
      { city: 'Birmingham', state: 'England' },
      { city: 'Liverpool', state: 'England' },
      { city: 'Leeds', state: 'England' },
      { city: 'Edinburgh', state: 'Scotland' },
      { city: 'Glasgow', state: 'Scotland' },
      { city: 'Cardiff', state: 'Wales' },
      { city: 'Belfast', state: 'Northern Ireland' },
    ],
  },
  // CANADA
  {
    country: 'Canada',
    code: 'CA',
    continent: 'North America',
    cities: [
      { city: 'Toronto', state: 'Ontario' },
      { city: 'Ottawa', state: 'Ontario' },
      { city: 'Vancouver', state: 'British Columbia' },
      { city: 'Montreal', state: 'Quebec' },
      { city: 'Calgary', state: 'Alberta' },
      { city: 'Edmonton', state: 'Alberta' },
      { city: 'Winnipeg', state: 'Manitoba' },
    ],
  },
  // AUSTRALIA
  {
    country: 'Australia',
    code: 'AU',
    continent: 'Oceania',
    cities: [
      { city: 'Sydney', state: 'New South Wales' },
      { city: 'Melbourne', state: 'Victoria' },
      { city: 'Brisbane', state: 'Queensland' },
      { city: 'Perth', state: 'Western Australia' },
      { city: 'Adelaide', state: 'South Australia' },
      { city: 'Gold Coast', state: 'Queensland' },
      { city: 'Canberra', state: 'ACT' },
    ],
  },
  // GERMANY
  {
    country: 'Germany',
    code: 'DE',
    continent: 'Europe',
    cities: [
      { city: 'Berlin', state: 'Berlin' },
      { city: 'Munich', state: 'Bavaria' },
      { city: 'Frankfurt', state: 'Hesse' },
      { city: 'Hamburg', state: 'Hamburg' },
      { city: 'Cologne', state: 'North Rhine-Westphalia' },
    ],
  },
  // FRANCE
  {
    country: 'France',
    code: 'FR',
    continent: 'Europe',
    cities: [
      { city: 'Paris', state: 'Île-de-France' },
      { city: 'Marseille', state: 'PACA' },
      { city: 'Lyon', state: 'Auvergne-Rhône-Alpes' },
      { city: 'Nice', state: 'PACA' },
      { city: 'Bordeaux', state: 'Nouvelle-Aquitaine' },
    ],
  },
  // UAE
  {
    country: 'United Arab Emirates',
    code: 'AE',
    continent: 'Asia',
    cities: [
      { city: 'Dubai', state: 'Dubai' },
      { city: 'Abu Dhabi', state: 'Abu Dhabi' },
      { city: 'Sharjah', state: 'Sharjah' },
    ],
  },
  // SINGAPORE
  {
    country: 'Singapore',
    code: 'SG',
    continent: 'Asia',
    cities: [
      { city: 'Singapore City', state: 'Central' },
      { city: 'Jurong', state: 'West' },
      { city: 'Tampines', state: 'East' },
    ],
  },
  // BANGLADESH
  {
    country: 'Bangladesh',
    code: 'BD',
    continent: 'Asia',
    cities: [
      { city: 'Dhaka', state: 'Dhaka Division' },
      { city: 'Chittagong', state: 'Chittagong Division' },
      { city: 'Sylhet', state: 'Sylhet Division' },
      { city: 'Rajshahi', state: 'Rajshahi Division' },
    ],
  },
  // JAPAN
  {
    country: 'Japan',
    code: 'JP',
    continent: 'Asia',
    cities: [
      { city: 'Tokyo', state: 'Kanto' },
      { city: 'Osaka', state: 'Kansai' },
      { city: 'Kyoto', state: 'Kansai' },
      { city: 'Yokohama', state: 'Kanagawa' },
    ],
  },
];
