import * as React from "react"
import { Context as RegionsDataContext } from "@Contexts/regionsData"
import { Context as NationalTrendDataContext } from "@Contexts/nationalTrendData"
import { Context as WorldDataContext } from "@Contexts/worldData"
import Layout from "@Components/layout"
import { useIntl } from "gatsby-plugin-intl"
import SEO from "@Components/seo"
import BigCard from "@Components/bigCard"
import CardCarousel from "@Components/cardCarousel"
import FakeCarousel from "@Components/fakeCarousel"
import LineChart from "@Components/lineChart"
import BarChart from "@Components/barChart"
import { get, last, slice, range } from "lodash"
// import MessageBox from "@Components/messageBox"
import { format, parseISO } from "date-fns"
import { it } from "date-fns/locale"
import RowCardAccordionList from "@Components/rowCardAccordionList"
import { NationalTrendDataType } from "@Types/nationalTrendData"

const IndexPage = () => {
  const { formatMessage } = useIntl()
  // @ts-ignore
  const { store: regionsDataStore, onGetRegionsData } = React.useContext(RegionsDataContext)
  // @ts-ignore
  const { store: nationalTrendDataStore, onGetNationalTrandData } = React.useContext(NationalTrendDataContext)
  // @ts-ignore
  const { store: worldDataStore, onGetWorldData } = React.useContext(WorldDataContext)
  const [regionsDataSorted, setRegionsDataSorted] = React.useState([])
  const [shouldShowAllRegions, setShouldShowAllRegion] = React.useState<boolean>(false)
  const [shouldShowAllWorldData, setShouldShowAllWorldData] = React.useState<boolean>(false)
  React.useEffect(() => {
    onGetNationalTrandData()
    onGetRegionsData()
    onGetWorldData()
  }, [])

  React.useEffect(() => {
    const { data } = regionsDataStore
    const dailyData = slice(data, data.length - 21, data.length)
    const sortedData = dailyData
      .sort(function(a: any, b: any) {
        return a.infected - b.infected
      })
      .reverse()

    setRegionsDataSorted(sortedData)
  }, [regionsDataStore])

  const onShowMoreRegions = () => {
    setShouldShowAllRegion(!shouldShowAllRegions)
  }

  const onShowMoreCountries = () => {
    setShouldShowAllWorldData(!shouldShowAllWorldData)
  }

  const { data: nationalTrendData }: { data: [NationalTrendDataType] } = nationalTrendDataStore
  const todayNationalTrendData = last(nationalTrendData)
  const dayBeforeTodayNationTrendDaata = nationalTrendData[nationalTrendData.length - 2]

  const lastWeekData = slice(nationalTrendData, nationalTrendData.length - 7)
  const labels = lastWeekData.map(i => format(new Date(parseISO(i.date)), "dd/LL"))
  const differenceFromYesterdayHealed =
    get(todayNationalTrendData, "healed", 0) - get(dayBeforeTodayNationTrendDaata, "healed", 0)
  const differenceFromYesterdayDeaths =
    // @ts-ignore
    get(todayNationalTrendData, "deaths", 0) - get(dayBeforeTodayNationTrendDaata, "deaths", 0)
  const infected = lastWeekData.map(i => i.infected)
  const newInfected = lastWeekData.map(i => i.newInfected)
  const healed = lastWeekData.map(i => i.healed)
  const deaths = lastWeekData.map(i => i.deaths)
  const testPerformed = lastWeekData.map(i => i.testPerformed)

  const infectedChartData = {
    labels,
    datasets: [
      {
        label: formatMessage({ id: "pages.homepage.lastWeekChartData1.datasetLabel1" }),
        fill: false,
        lineTension: 0.2,
        backgroundColor: "#E86379",
        borderColor: "#E86379",
        borderCapStyle: "butt",
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "#E86379",
        pointBackgroundColor: "#E86379",
        pointBorderWidth: 4,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#E86379",
        pointHoverBorderColor: "#E86379",
        pointHoverBorderWidth: 5,
        data: infected,
      },
      {
        label: formatMessage({ id: "pages.homepage.lastWeekChartData1.datasetLabel4" }),
        fill: false,
        lineTension: 0.2,
        backgroundColor: "#fcdca3",
        borderColor: "#fcdca3",
        borderCapStyle: "butt",
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "#fcdca3",
        pointBackgroundColor: "#fcdca3",
        pointBorderWidth: 4,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#fcdca3",
        pointHoverBorderColor: "#fcdca3",
        pointHoverBorderWidth: 5,
        data: testPerformed,
      },
      {
        label: formatMessage({ id: "pages.homepage.lastWeekChartData1.datasetLabel2" }),
        fill: false,
        lineTension: 0.1,
        backgroundColor: "#20D6A5",
        borderColor: "#20D6A5",
        borderCapStyle: "butt",
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "#20D6A5",
        pointBackgroundColor: "#20D6A5",
        pointBorderWidth: 4,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#20D6A5",
        pointHoverBorderColor: "#20D6A5",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: healed,
      },
      {
        label: formatMessage({ id: "pages.homepage.lastWeekChartData1.datasetLabel3" }),
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "#000b33",
        borderCapStyle: "butt",
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "#000b33",
        pointBackgroundColor: "#000b33",
        pointBorderWidth: 4,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#000b33",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: deaths,
      },
    ],
  }

  const testPerformedChartData = {
    labels,
    datasets: [
      {
        label: formatMessage({ id: "pages.homepage.lastWeekChartData2.datasetLabel1" }),
        data: newInfected,
        backgroundColor: "#fcdca3",
        hoverBackgroundColor: "#fbc870",
      },
    ],
  }

  const renderBigCardLoadingState = (key: number) => {
    return (
      <div key={key} className="fake-carousel__item">
        <BigCard isLoading />
      </div>
    )
  }

  const renderFakeCarousel = () => {
    return <FakeCarousel>{range(3).map(renderBigCardLoadingState)}</FakeCarousel>
  }

  const renderCarousel = () => {
    return (
      <CardCarousel>
        <BigCard
          emoji="😷"
          title={formatMessage({ id: "pages.homepage.bigCardInfected.title" })}
          content={`${get(todayNationalTrendData, "infected", 0).toLocaleString()}`}
          additionalContent={`${get(todayNationalTrendData, "newInfected", 0) > 0 ? "+" : ""}${get(
            todayNationalTrendData,
            "newInfected",
            0
          ).toLocaleString()} ${formatMessage({
            id: "pages.homepage.bigCardInfected.additionalContentLabel",
          })}`}
          subContent={`${formatMessage({ id: "pages.homepage.bigCardInfected.subContentLabel" })} ${get(
            todayNationalTrendData,
            "totalCases",
            0
          ).toLocaleString()}`}
        />
        <BigCard
          emoji="😊"
          additionalContentType="success"
          title={formatMessage({ id: "pages.homepage.bigCardHealed.title" })}
          additionalContent={`${
            differenceFromYesterdayHealed > 0 ? "+" : ""
          }${differenceFromYesterdayHealed.toLocaleString()} ${formatMessage({
            id: "pages.homepage.bigCardHealed.additionalContentLabel",
          })}`}
          content={get(todayNationalTrendData, "healed", 0).toLocaleString()}
        />
        <BigCard
          emoji="😢"
          title={formatMessage({ id: "pages.homepage.bigCardDeaths.title" })}
          additionalContent={`${
            differenceFromYesterdayDeaths > 0 ? "+" : ""
          }${differenceFromYesterdayDeaths.toLocaleString()} ${formatMessage({
            id: "pages.homepage.bigCardDeaths.additionalContentLabel",
          })}`}
          content={get(todayNationalTrendData, "deaths", 0).toLocaleString()}
          subContent={formatMessage({ id: "pages.homepage.bigCardDeaths.subContentLabel" })}
        />
      </CardCarousel>
    )
  }

  return (
    <Layout>
      <div>
        <SEO
          title={formatMessage({ id: "pages.homepage.title" })}
          description={formatMessage({ id: "globals.header.description" })}
          path="/"
        />
        <div className="homepage">
          <div className="homepage__wrap">
            <div style={{ marginLeft: "auto", marginRight: "auto" }} className="u-margin-bottom-spacer-huge">
              {/* <MessageBox type="error">
                <p>
                  {formatMessage({ id: "pages.homepage.messageBoxLabel" })}{" "}
                  <Link to="/updates/">{formatMessage({ id: "pages.homepage.messageBoxCtaLabel" })}</Link>.
                </p>
              </MessageBox> */}
            </div>
            <div className="homepage__item homepage__item--big-cards">
              <>
                {!todayNationalTrendData ? renderFakeCarousel() : renderCarousel()}
                {todayNationalTrendData && (
                  <p>
                    {formatMessage({ id: "pages.homepage.lastUpdateLabel" })}{" "}
                    {format(new Date(parseISO(get(todayNationalTrendData, "date", ""))), "dd/LL/yyyy – H:mm", {
                      locale: it,
                    })}{" "}
                    –{" "}
                    <a href="http://www.protezionecivile.gov.it/home" rel="noopener noreferrer" target="_blank">
                      {formatMessage({ id: "pages.homepage.lastUpdateCtaLabel" })}
                    </a>{" "}
                  </p>
                )}
              </>
            </div>
            <div className="homepage__item homepage__item--region-chart u-margin-top-spacer-xxlarge u-margin-bottom-spacer-xlarge">
              <div className="container--internal">
                <h2 className="u-margin-bottom-spacer-large">
                  {formatMessage({ id: "pages.homepage.allRegions.title" })}
                </h2>
                <RowCardAccordionList
                  list={!shouldShowAllRegions ? [...regionsDataSorted.slice(0, 10)] : regionsDataSorted}
                  numberOfFakeCards={10}
                  isLoading={!regionsDataSorted.length}
                />
                <div className="homepage-region-chart-cta">
                  <a onClick={onShowMoreRegions} className="button button--primary">
                    {!shouldShowAllRegions
                      ? formatMessage({ id: "pages.homepage.allRegions.allRegionShowMoreCtaLabel" })
                      : formatMessage({ id: "pages.homepage.allRegions.allRegionShowLessCtaLabel" })}
                  </a>
                </div>
              </div>
            </div>

            <div className="homepage__item homepage__item--half u-margin-top-spacer-xlarge u-margin-bottom-spacer-xlarge">
              <h2 className="u-margin-bottom-spacer-large">
                {formatMessage({ id: "pages.homepage.lastWeekChartData1.title" })}
              </h2>
              <div className="card">
                <div className="card__wrap">
                  <div className="card__item">
                    <LineChart
                      data={infectedChartData}
                      options={{
                        legend: { position: "bottom", labels: { fontFamily: "Lato", padding: 16, fontStyle: "bold" } },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="homepage__item homepage__item--half u-margin-top-spacer-xlarge u-margin-bottom-spacer-xlarge">
              <h2 className="u-margin-bottom-spacer-large">
                {formatMessage({ id: "pages.homepage.lastWeekChartData2.title" })}
              </h2>
              <div className="card">
                <div className="card__wrap">
                  <div className="card__item">
                    <BarChart
                      data={testPerformedChartData}
                      options={{
                        legend: { display: false },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="homepage__item homepage__item--region-chart u-margin-top-spacer-xxlarge u-margin-bottom-spacer-xlarge">
              <div className="container--internal">
                <h2 className="u-margin-bottom-spacer-large">
                  {formatMessage({ id: "pages.homepage.allCountries.title" })}
                </h2>
                <RowCardAccordionList
                  enableAccordion={false}
                  list={
                    !shouldShowAllWorldData && worldDataStore.data.length
                      ? [...worldDataStore.data.slice(0, 10)]
                      : worldDataStore.data
                  }
                  numberOfFakeCards={10}
                  isLoading={!worldDataStore.data.length}
                />
                <p className="u-text-right">
                  <a rel="noopener noreferrer" target="_blank" href="https://github.com/sharadcodes/covid19-graphql">
                    <strong>{formatMessage({ id: "pages.homepage.allCountries.dataSourceLabel" })}</strong>
                  </a>
                </p>
                <div className="homepage-region-chart-cta">
                  <a onClick={onShowMoreCountries} className="button button--primary">
                    {!shouldShowAllWorldData
                      ? formatMessage({ id: "pages.homepage.allRegions.allRegionShowMoreCtaLabel" })
                      : formatMessage({ id: "pages.homepage.allRegions.allRegionShowLessCtaLabel" })}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage
