import styled from 'styled-components';


const VenuesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`;

const ListOfVenues = styled.table`
  max-width: 100%;
  overflow: hidden;
  th {
    background-color: black;
    color: white;
    padding: 5px;
  }
  th {
    height: 40px;
  }
  td {
    padding: 10px 5px;
  }
  tr:nth-child(2n + 3) {
    background-color: #e5e5e5;
  }
`;
const TableTitle = styled.div`
  text-align: center;
`;

function VenuesTable({venues}) {

  return (
      <VenuesWrapper>
          {Object.keys(venues).length !== 0 && (
            <>
              <TableTitle>
                <h3>Venues</h3>
              </TableTitle>
              <ListOfVenues>
                <thead>
                  <tr>
                    <th>Venue</th>
                    <th>Suburb</th>
                    <th>Address</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {venues?.data?.length > 0 &&
                    venues.data.map((venue, i) => (
                      <tr key={`monitor${i}`}>
                        <td>{venue.Venue}</td>
                        <td>{venue.Suburb}</td>
                        <td>{venue.Address}</td>
                        <td>{venue.Date}</td>
                        <td>{venue.Time}</td>
                      </tr>
                    ))}
                </tbody>
              </ListOfVenues>
            </>
          )}
        </VenuesWrapper> 
  );
}

export default VenuesTable;