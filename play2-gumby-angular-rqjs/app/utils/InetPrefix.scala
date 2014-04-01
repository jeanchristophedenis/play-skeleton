package utils

/**
 * Created by alain on 27/03/2014.
 */
import java.net.{ InetSocketAddress, InetAddress, UnknownHostException }
import scala.util.Success
import play.api.Logger

object Tryo {
  def apply[T](f: => T): Option[T] = scala.util.Try(f) match { case Success(x) => Some(x) case _ => None }
  def apply[T](f: => T, fallback: T): T = scala.util.Try(f) getOrElse fallback
}

/**
 * Helper Object for creating InetPrefix-objects.
 */
object InetPrefix {
  def apply(prefix: InetAddress, prefixLen: Int): InetPrefix = {
    if (prefix.getAddress.length == 16)
      new Inet6Prefix(prefix, prefixLen)
    else
      new Inet4Prefix(prefix, prefixLen)
  }

  /**
   * Converts a String to an InetSocketAddress with respects to IPv6 ([123:123::123]:80).
   * @param string IP Address to convert
   * @return InetSocketAddress
   */
  def stringToInetSocketAddr(string: String): Option[InetSocketAddress] = string match {
    case ipv4: String if ipv4.matches("""\d+\.\d+\.\d+\.\d+:\d+""") =>
      val split = ipv4.split(":")
      Tryo(new java.net.InetSocketAddress(split(0), split(1).toInt))
    case ipv6: String if ipv6.matches("""\[[0-9a-fA-F:]+\]:\d+""") =>
      val split = ipv6.split("]:")
      val addr = split(0).replaceFirst("\\[", "")
      Tryo(new java.net.InetSocketAddress(java.net.InetAddress.getByName(addr), split(1).toInt))
    case _ => None
  }

  def inetAddrToLong(addr: InetAddress): Long =
    (0L to 3L).toArray.foldRight(0L)((i, ip) => ip | (addr.getAddress()(3 - i.toInt) & 0xff).toLong << i * 8)


  def requestRemoteAddrToInetAddrs(remoteAddress: String):List[InetAddress] = {
    remoteAddress.split(",").foldLeft(List[InetAddress]()){ (ips, str) =>
      try {
        ips ::: List(java.net.InetAddress.getByName(str.trim))
      } catch {
        case e:Throwable =>
          Logger.error(s"invalid IP: ${str.trim}", e)
          ips
      }
    }
  }

  def stringToInetAddr(string: String): Option[InetAddress] = string match {
      case ipv4: String if ipv4.matches( """\d+\.\d+\.\d+\.\d+""") =>
        Tryo(java.net.InetAddress.getByName(ipv4))
      case ipv6: String if ipv6.matches( """[0-9a-fA-F:]+""" ) =>
        Tryo(java.net.InetAddress.getByName(ipv6))
      case _ => None
    }

}

/**
 * Common Interface for both protocol types.
 */
trait InetPrefix {

  /**
   * Base IP-Address of the Prefix.
   */
  val prefix: InetAddress

  /**
   * Length of the Prefix. 0-32 for IPv4 and 0-128 for IPv6.
   */
  val prefixLen: Int

  /**
   * Either 4 for IPv4 or 6 for IPv6.
   */
  val ipVersion: Int

  /**
   * Check if the given InetAddress is contained in this prefix.
   */
  def contains(addr: InetAddress): Boolean

  private def prefixAddr() = prefix.getHostAddress
  override val toString = prefixAddr + "/" + prefixLen
}

/**
 * Inet6Prefix object to hold information about an IPv6 Prefix.
 *
 * Currently only containment checks are implemented.
 *
 * @param prefix Base-Address for the Prefix
 * @param prefixLen Length of this Prefix in CIDR notation
 */
class Inet6Prefix(val prefix: InetAddress, val prefixLen: Int) extends InetPrefix {
  val ipVersion = 6
  if (prefixLen < 0 || prefixLen > 128)
    throw new UnknownHostException(prefixLen + " is not a valid IPv6 Prefix-Length (0-128)")

  private lazy val network: Array[Byte] = prefix.getAddress
  private lazy val netmask: Array[Byte] = {
    var netmask: Array[Byte] = Array.fill(16)(0xff.toByte)
    val maskBytes: Int = prefixLen / 8
    if (maskBytes < 16) netmask(maskBytes) = (0xff.toByte << 8 - (prefixLen % 8)).toByte
    for (i <- maskBytes + 1 to (128 / 8) - 1) netmask(i) = 0
    netmask
  }

  /**
   * Check if the given InetAddress is contained in this IPv6 prefix.
   */
  def contains(addr: InetAddress): Boolean = {
    if (addr.getAddress.length != 16) {
      Logger.error("Inet6Prefix cannot check against Inet4Address")
      return false
    }

    val candidate = addr.getAddress
    for (i <- 0 to netmask.length - 1)
      if ((candidate(i) & netmask(i)) != (network(i) & netmask(i))) return false
    true
  }
}

/**
 * Inet4Prefix object to hold information about an IPv4 Prefix.
 *
 * Currently only containment checks are implemented.
 *
 * @param prefix Base-Address for the Prefix
 * @param prefixLen Length of this Prefix in CIDR notation
 */
class Inet4Prefix(val prefix: InetAddress, val prefixLen: Int) extends InetPrefix {
  val ipVersion = 4
  if (prefixLen < 0 || prefixLen > 32)
    throw new UnknownHostException(prefixLen + " is not a valid IPv4 Prefix-Length (0-32)")

  private lazy val netmask: Long = (((1L << 32) - 1) << (32 - prefixLen)) & 0xFFFFFFFFL
  private lazy val start: Long = InetPrefix.inetAddrToLong(prefix) & netmask
  private lazy val stop: Long = start + (0xFFFFFFFFL >> prefixLen)

  /**
   * Check if the given InetAddress is contained in this IPv4 prefix.
   * @param addr The InetAddr which is to be checked.
   */
  def contains(addr: InetAddress): Boolean = {
    if (addr.getAddress.length != 4) {
      Logger.error("Inet4Prefix cannot check against Inet6Address")
      return false
    }

    val candidate = InetPrefix.inetAddrToLong(addr)
    candidate >= start && candidate <= stop
  }
}
